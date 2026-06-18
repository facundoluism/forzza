import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { adminClient, user } = await requireAdmin();
    const { id } = await params;

    const { data: video, error: fetchError } = await adminClient
      .from("exercise_videos")
      .select("id, exercise_id, lang, youtube_id, status")
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

    const { error: deleteError } = await adminClient
      .from("exercise_videos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

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
