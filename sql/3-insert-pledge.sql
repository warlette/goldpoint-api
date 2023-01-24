--NEW PLEDGE INFO
DO $$BEGIN

CREATE OR REPLACE FUNCTION pledge(
	customerid integer,
	isgold boolean,
	pawnticket integer,
	amount numeric,
	interest numeric,
	frequency numeric,
	description character varying,
	servicecharge numeric,
	remarks character varying,
	pledgedby integer)
    RETURNS integer
AS $BODY$

DECLARE
   v_id integer;
   pticket integer;
   netproceed numeric;
BEGIN

	IF NOT EXISTS (SELECT 'WARLETTE' FROM customers WHERE id = custid) AND custid IS NOT NULL THEN
		
		v_id := -1;
		
	ELSE
	
		pticket := pawnticket;
	
		IF NOT EXISTS (SELECT 'WARLETTE' FROM pledges WHERE pawnticket = pticket) AND pawnticket IS NOT NULL THEN
	
			
			-- Inserts the new pledge record and retrieves the last inserted id
			INSERT INTO pledges(customerid,
							isgold,
							pawnticket,
							type,
							amount,
							interest,
							frequency,
							description,
							servicecharge,
							remarks,
							dateadded,
							pledgedby)
				VALUES (customerid,
							isgold,
							pawnticket,
							1,
							amount,
							interest,
							frequency,
							description,
							servicecharge,
							remarks,
							NOW(),
							pledgedby)
			RETURNING id INTO v_id;
			
			netproceed := amount - (amount * (interest / 100.00)) - servicecharge;
			
			INSERT INTO funds (amount,
							pledgeid,
							type,
							remarks,
							dateadded,
							addedby)
				VALUES (netproceed,
							v_id,
							1,
							'Pledge',
							NOW(),
							pledgedby);
			
		ELSE
		
			v_id := -2;
			
		END IF;
		
	END IF;
   -- Return the new id so we can use it in a select clause or return the new id into the user application
    RETURN v_id;
END;

$BODY$

LANGUAGE plpgsql;

END $$;
  
  