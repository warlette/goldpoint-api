--RENEW INFO
DO $$BEGIN
CREATE OR REPLACE FUNCTION renew
(
	pawnticket character varying,
	amount numeric,
	amtprepaid numeric,
	penalty numeric,
    remarks character varying,
    addedby integer
)
  RETURNS integer AS
$BODY$
DECLARE
   v_id integer;
   pid integer;
   pticket character varying;
   pnlty numeric;
BEGIN

	IF EXISTS (SELECT 'WARLETTE' FROM pledges WHERE pawnticket = pticket) AND pticket IS NOT NULL THEN
		
		pnlty := penalty;
		pid := (SELECT id FROM pledges WHERE pawnticket = pticket LIMIT 1);
		
		UPDATE pledges SET amountrenewed = amount,
			amountprepaid = amtprepaid,
			penalty = pnlty,
			remarksrenew = remarks,
			type = 3,
			daterenewed = NOW()
		WHERE id = pid;
		
		v_id := 0;
		
	ELSE
	
		v_id := -1;
		
	END IF;
   -- Return the new id so we can use it in a select clause or return the new id into the user application
    RETURN v_id;
END;

$BODY$

LANGUAGE plpgsql;

END $$;
  
  