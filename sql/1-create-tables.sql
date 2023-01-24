--USERS
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'users'
        ) THEN

        CREATE TABLE users
        (
            id serial,
            username character varying,
            password character varying,
            email character varying,
            contact character varying,
            address character varying,
            dateadded date
        );

    END IF;
END $$;

--ROLES INFO
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'roles'
        ) THEN

        CREATE TABLE roles
        (
            id serial,
            rolename character varying,
            descriptions character varying,
            dateadded date,
            addedby integer
        );

    END IF;
END $$;

--USERROLES INFO
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'userroles'
        ) THEN

        CREATE TABLE userroles
        (
            id serial,
            roleid integer,
            userid integer,
            status boolean,
            dateadded date,
            addedby integer
        );
    END IF;
END $$;

--CUSTOMERS INFO
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'customers'
        ) THEN

        CREATE TABLE customers
        (
            id serial,
            firstname character varying,
            middlename character varying,
            lastname character varying,
            birthdate date,
            contact character varying,
            address character varying,
            idpresented character varying,
            email character varying,
            remarks character varying,
            dateadded date,
            datemodified date,
            addedby integer
        );
    END IF;
END $$;

--BLOCKED CUSTOMERS INFO
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'blockedcustomers'
        ) THEN

        CREATE TABLE blockedcustomers
        (
            id serial,
            firsname character varying,
            middlename character varying,
            lastname character varying,
            address character varying,
            dateadded date,
            addedby integer
        );
    END IF;
END $$;

--LOAN INFO
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'pledges'
        ) THEN
        
        CREATE TABLE pledges
        (
            id serial,
            customerid integer,
            isgold boolean,
            pawnticket character varying,
            pawnticketold character varying,
            type integer,
            amount numeric,
            amountredeemed numeric,
            amountprepaid numeric,
            amountrenewed numeric,
            amountsold numeric,
            penalty numeric,
            interest numeric,
            frequency integer,
            description character varying,
            servicecharge numeric,
            dateadded date,
            dateredeemed date,
            daterenewed date,
            daterepossessed date,
            datesold date,
            soldto character varying,
            remarks character varying,
            remarksredeem character varying,
            remarksrenew character varying,
            remarkssold character varying,
            pledgedby integer,
            redeemedby integer,
            renewedby integer,
            soldby integer
        );
    END IF;
END $$;

--FUNDS
DO $$BEGIN
    IF NOT EXISTS (SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'funds'
        ) THEN
        
        CREATE TABLE funds
        (
            id serial,
            amount numeric,
            pledgeid integer,
            type integer,
            remarks character varying,
            dateadded date,
            addedby integer
        );
    END IF;
END $$;
