--REDEEM INFO
DO $$BEGIN

CREATE OR REPLACE FUNCTION redeem(
	pawnticket character varying,
	amount numeric,
	penalty numeric,
	remarks character varying,
	redeemedby integer)
    RETURNS integer
	
AS $BODY$

DECLARE
   v_id integer;
   pid integer;
   pticket character varying;
   pnlty numeric;
   rmrks character varying;
   rdmdby integer;
BEGIN

	IF EXISTS (SELECT 'WARLETTE' FROM pledges WHERE pawnticket = pticket) AND pticket IS NOT NULL THEN
		
		pnlty := penalty;
		rmrks := remarks;
		pid := (SELECT id FROM pledges WHERE pawnticket = pticket LIMIT 1);
		rdmdby := redeemedby;
		UPDATE pledges SET amountredeemed = amount,
			penalty = pnlty,
			remarksredeem = remarks,
			type = 2,
			redeemedby = rdmdby,
			dateredeemed = NOW()
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



