CREATE TABLE kv
(
   id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
   key character varying(255) NOT NULL UNIQUE, 
   value character varying(255) NOT NULL
);

ALTER TABLE kv OWNER TO postgres;
