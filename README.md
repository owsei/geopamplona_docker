

For SRID de postgis

/*obtiene los datos del campo*/
SELECT Find_SRID('public', 'TABLE_TO_CHANGE', 'geom');

/*listado de tablas a cambiar*/
SELECT
  'ALTER TABLE "' || f_table_schema || '"."' || f_table_name || '" ' ||
  'ALTER COLUMN ' || f_geometry_column || ' TYPE geometry(' || type || ', 25830) ' ||
  'USING ST_SetSRID(' || f_geometry_column || ', 25830);'
FROM geometry_columns
WHERE srid = 0;
