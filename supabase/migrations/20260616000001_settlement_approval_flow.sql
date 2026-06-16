-- Add the owner approval step required before a settlement can be transferred.
ALTER TYPE settlement_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE settlement_status ADD VALUE IF NOT EXISTS 'rejected';

ALTER TABLE settlements
  ADD COLUMN IF NOT EXISTS invoice_rejection_reason TEXT;

CREATE OR REPLACE FUNCTION check_settlement_invoice()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'transferred' AND OLD.status IS DISTINCT FROM 'transferred' THEN
    IF OLD.status IS DISTINCT FROM 'approved' THEN
      RAISE EXCEPTION 'No se puede transferir sin factura aprobada';
    END IF;

    IF NEW.invoice_number IS NULL OR btrim(NEW.invoice_number) = ''
       OR NEW.invoice_path IS NULL OR btrim(NEW.invoice_path) = '' THEN
      RAISE EXCEPTION 'No se puede transferir sin factura aprobada (invoice_number e invoice_path son requeridos)';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
