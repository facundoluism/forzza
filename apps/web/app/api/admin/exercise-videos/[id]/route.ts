import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import type { Json } from "@forzza/db-types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { adminClient, user } = await requireAdmin();
    const { id } = await params;
    const body = (await req.json()) as { action: "publish" | "unpublish" };

    if (body.action !== "publish" && body.action !== "unpublish") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Fetch the video row
    const { data: video, error: fetchError } = await adminClient
      .from("exercise_videos")
      .select("id, exercise_id, lang, youtube_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !video) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch exercise name for audit payload
    const { data: exercise } = await adminClient
      .from("exercise_library")
      .select("name, name_en")
      .eq("id", video.exercise_id)
      .single();

    const new_status = body.action === "publish" ? "published" : "needs_review";
    const previous_status = video.status;

    const { error: updateError } = await adminClient
      .from("exercise_videos")
      .update({ status: new_status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await adminClient.from("audit_log").insert({
      actor_id: user.id,
      action:
        body.action === "publish"
          ? "exercise_video.published"
          : "exercise_video.unpublished",
      entity_type: "exercise_videos",
      entity_id: id,
      payload: {
        previous_status,
        new_status,
        exercise_id: video.exercise_id,
        lang: video.lang,
        youtube_id: video.youtube_id,
        exercise_name: exercise?.name ?? null,
      },
    });

    return NextResponse.json({ ok: true, status: new_status });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Body sent by VideoReviewActions modal
// ---------------------------------------------------------------------------
interface DiscardBody {
  reasons?: Array<"bad_channel" | "wrong_variant" | "is_short" | "wrong_lang">;
  queryAdd?: string[];
  queryRemove?: string[];
  pinYoutubeId?: string;
  note?: string;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { adminClient, user } = await requireAdmin();
    const { id } = await params;

    // Parse optional feedback body (modal sends JSON, old callers send no body)
    let body: DiscardBody = {};
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      try {
        body = (await req.json()) as DiscardBody;
      } catch {
        // empty body is fine
      }
    }

    const reasons = body.reasons ?? [];
    const queryAdd = (body.queryAdd ?? []).filter(Boolean);
    const queryRemove = (body.queryRemove ?? []).filter(Boolean);

    // Validate: wrong_variant needs at least one term
    if (reasons.includes("wrong_variant") && queryAdd.length === 0 && queryRemove.length === 0) {
      return NextResponse.json(
        { error: "Especificá al menos un término para ajustar la búsqueda." },
        { status: 400 }
      );
    }

    // Validate pin video id format if provided
    const pinYoutubeId = body.pinYoutubeId?.trim() ?? null;
    if (pinYoutubeId && !/^[A-Za-z0-9_-]{11}$/.test(pinYoutubeId)) {
      return NextResponse.json(
        { error: "El ID de YouTube del video a fijar no es válido." },
        { status: 400 }
      );
    }

    // Fetch the video row (need exercise_id, lang, youtube_id, channel_title)
    const { data: video, error: fetchError } = await adminClient
      .from("exercise_videos")
      .select("id, exercise_id, lang, youtube_id, channel_title, status")
      .eq("id", id)
      .single();

    if (fetchError || !video) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: exercise } = await adminClient
      .from("exercise_library")
      .select("name, name_en")
      .eq("id", video.exercise_id)
      .single();

    // -----------------------------------------------------------------------
    // Build feedback rows to insert
    // -----------------------------------------------------------------------
    type FeedbackInsert = {
      exercise_id: string | null;
      lang: string | null;
      action: string;
      youtube_id: string | null;
      channel_title: string | null;
      query_add: string[] | null;
      query_remove: string[] | null;
      filters: Json | null;
      note: string | null;
      created_by: string;
    };

    const feedbackRows: FeedbackInsert[] = [];
    const noteValue = body.note?.trim() ?? null;

    // Always: block the discarded video (per exercise + lang)
    feedbackRows.push({
      exercise_id: video.exercise_id,
      lang: video.lang,
      action: "block_video",
      youtube_id: video.youtube_id,
      channel_title: video.channel_title ?? null,
      query_add: null,
      query_remove: null,
      filters: null,
      note: noteValue,
      created_by: user.id,
    });

    // bad_channel → block the whole channel globally (exercise_id NULL)
    if (reasons.includes("bad_channel") && video.channel_title) {
      feedbackRows.push({
        exercise_id: null,
        lang: null,
        action: "block_channel",
        youtube_id: null,
        channel_title: video.channel_title,
        query_add: null,
        query_remove: null,
        filters: null,
        note: noteValue,
        created_by: user.id,
      });
    }

    // wrong_variant → adjust_query (per exercise + lang)
    if (reasons.includes("wrong_variant")) {
      feedbackRows.push({
        exercise_id: video.exercise_id,
        lang: video.lang,
        action: "adjust_query",
        youtube_id: null,
        channel_title: null,
        query_add: queryAdd.length > 0 ? queryAdd : null,
        query_remove: queryRemove.length > 0 ? queryRemove : null,
        filters: null,
        note: noteValue,
        created_by: user.id,
      });
    }

    // is_short → set_filter excludeShorts + minDuration (per exercise + lang)
    if (reasons.includes("is_short")) {
      feedbackRows.push({
        exercise_id: video.exercise_id,
        lang: video.lang,
        action: "set_filter",
        youtube_id: null,
        channel_title: null,
        query_add: null,
        query_remove: null,
        filters: { excludeShorts: true, minDuration: 60 },
        note: noteValue,
        created_by: user.id,
      });
    }

    // wrong_lang → set_filter strictLang (per exercise + lang)
    if (reasons.includes("wrong_lang")) {
      feedbackRows.push({
        exercise_id: video.exercise_id,
        lang: video.lang,
        action: "set_filter",
        youtube_id: null,
        channel_title: null,
        query_add: null,
        query_remove: null,
        filters: { strictLang: true },
        note: noteValue,
        created_by: user.id,
      });
    }

    // pin_video → if a replacement video ID was provided (per exercise + lang)
    if (pinYoutubeId) {
      feedbackRows.push({
        exercise_id: video.exercise_id,
        lang: video.lang,
        action: "pin_video",
        youtube_id: pinYoutubeId,
        channel_title: null,
        query_add: null,
        query_remove: null,
        filters: null,
        note: noteValue,
        created_by: user.id,
      });
    }

    // -----------------------------------------------------------------------
    // Delete the video row
    // -----------------------------------------------------------------------
    const { error: deleteError } = await adminClient
      .from("exercise_videos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // -----------------------------------------------------------------------
    // Insert feedback rows (best-effort: don't roll back the delete on failure)
    // -----------------------------------------------------------------------
    const { error: feedbackError } = await adminClient
      .from("exercise_video_feedback")
      .insert(feedbackRows);

    // -----------------------------------------------------------------------
    // Audit log
    // -----------------------------------------------------------------------
    await adminClient.from("audit_log").insert({
      actor_id: user.id,
      action: "exercise_video.discarded",
      entity_type: "exercise_videos",
      entity_id: id,
      payload: {
        previous_status: video.status,
        new_status: null,
        exercise_id: video.exercise_id,
        lang: video.lang,
        youtube_id: video.youtube_id,
        exercise_name: exercise?.name ?? null,
        feedback_reasons: reasons,
        feedback_rows_count: feedbackRows.length,
        feedback_error: feedbackError?.message ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
