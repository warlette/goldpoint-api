--INSERT CUSTOMERS INFO
DO $$BEGIN
CREATE OR REPLACE FUNCTION new_customer
(
	custid int,
    fname character varying,
    mname character varying,
    lname character varying,
    bdate date,
    ctact character varying,
    addr character varying,
    idprd character varying,
    emailad character varying,
    rmrks character varying,
    addby integer
)
  RETURNS integer AS
$BODY$
DECLARE
   v_id integer;
BEGIN

	IF NOT EXISTS (SELECT 'WARLETTE' FROM customers WHERE id = custid) AND custid IS NOT NULL THEN
		-- Inserts the new customer record and retrieves the last inserted id
		INSERT INTO customers(firstname, middlename, lastname, birthdate, contact, address, idpresented, email, remarks, dateadded, addedby)
		VALUES (fname, mname, lname, bdate, ctact, addr, idprd, emailad, rmrks, NOW(), addby)
		RETURNING id INTO v_id;
	ELSE
		v_id := custid;
		
		UPDATE customers SET firstname = fname,
			middlename = mname,
			lastname = lname,
			birthdate = bdate,
			contact = ctact,
			address = addr,
			idpresented = idprd,
			email = emailad,
			remarks = rmrks
		WHERE id = v_id;
		
		--Inserts new history here
			
		
	END IF;
   -- Return the new id so we can use it in a select clause or return the new id into the user application
    RETURN v_id;
END;
$BODY$
LANGUAGE plpgsql;

END $$;
  
  