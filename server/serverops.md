
Manually start and stop the server using these commands:
pg_ctl -D /usr/local/var/postgres start
pg_ctl -D /usr/local/var/postgres stop

To open postgres shell:
psql postgres

Basic Commands:

    \list - List all of your actual databases.
    \c mydatabasename - Connect to another database.
    \d - List the relations of your currently connected database.
    \d mytablename - Shows information for a specific table.
