--ADD FUNDS
DO $$BEGIN
CREATE OR REPLACE FUNCTION add_funds(
	amount numeric,
	remarks character varying,
	addedby integer)
    RETURNS integer
AS $BODY$

DECLARE
   v_id integer;
BEGIN

    INSERT INTO funds (amount, type, remarks, dateadded, addedby)
    VALUES (amount, 10, textcat(remarks, text ' | Added Funds'), now(), addedby)
    RETURNING id INTO v_id;

   -- Return the new id so we can use it in a select clause or return the new id into the user application
    RETURN v_id;
END;

$BODY$

LANGUAGE plpgsql;

END $$;




