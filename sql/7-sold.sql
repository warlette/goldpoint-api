--REPOSSESS INFO
DO $$BEGIN

CREATE OR REPLACE FUNCTION sold(
	pticket character varying,
	soldto character varying,
	amount numeric,
	soldby integer
	)
    RETURNS integer
	
AS $BODY$

DECLARE
   v_id integer;
   pid integer;
   sold_to character varying;
   sold_by character varying;
BEGIN


	IF EXISTS (SELECT 'WARLETTE' FROM pledges WHERE pawnticket = pticket AND type = 4) AND pticket IS NOT NULL THEN
		
		pid := (SELECT id FROM pledges WHERE pawnticket = pticket LIMIT 1);
		sold_to := soldto;
		sold_by := soldby;
		
		UPDATE pledges SET type = 5,
			amountsold = amount,
			soldto = sold_to,
			datesold = NOW(),
			soldby = sold_by
		WHERE id = pid;
		
		INSERT INTO funds (pledgeid, amount, type, remarks, dateadded, addedby)
		VALUES (pid, amount, 5, 'Sold', NOW, soldby);
		
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




