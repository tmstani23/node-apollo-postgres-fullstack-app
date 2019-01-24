
Manually start and stop the server using these commands:
pg_ctl -D /usr/local/var/postgres start
pg_ctl -D /usr/local/var/postgres stop

To open postgres shell:
psql -d godatabase -U a83h8zz



Basic Commands:

    \list - List all of your actual databases.
    \c mydatabasename - Connect to another database.
    \d - List the relations of your currently connected database.
    \d mytablename - Shows information for a specific table.

    SELECT * from users;
    SELECT text from messages;

Heroku postgres database url:
postgres://dvmdjxyzdadzfx:8fef95fe9997bb51dc97061f4fe6c5a57b72ed30f081e9733831dce088762a7b@ec2-54-243-228-140.compute-1.amazonaws.com:5432/d5pvnc74di1hbi

Heroku cli commands
git push heroku master - deploy build to heroku