--REPOSSESS INFO
DO $$BEGIN

CREATE OR REPLACE FUNCTION repossess()
    RETURNS integer
AS $BODY$

DECLARE
BEGIN
	
	UPDATE pledges SET type = 4,
		daterepossessed = (current_date + cast('4 months' as interval) + cast('5 days' as interval))::date
	WHERE dateadded::date >= (current_date + cast('4 months' as interval) + cast('5 days' as interval))::date
		AND type = 1;
	
	RETURN 0;
END;

$BODY$

LANGUAGE plpgsql;


END $$;

