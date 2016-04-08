-- POC ON
delete from configuration.role_privileges where privID in (5,6,130,131);

-- put back to a known good starting state with the old privilege
insert into configuration.role_privileges (privID, roleID) values (5, 1);
insert into configuration.role_privileges (privID, roleID) values (5, 2);
insert into configuration.role_privileges (privID, roleID) values (5, 6);
insert into configuration.role_privileges (privID, roleID) values (5, 9);
insert into configuration.role_privileges (privID, roleID) values (5, 11);
insert into configuration.role_privileges (privID, roleID) values (5, 16);
insert into configuration.role_privileges (privID, roleID) values (5, 17);
insert into configuration.role_privileges (privID, roleID) values (6, 5);
insert into configuration.role_privileges (privID, roleID) values (6, 7);
insert into configuration.role_privileges (privID, roleID) values (6, 12);
insert into configuration.role_privileges (privID, roleID) values (6, 18);
insert into configuration.role_privileges (privID, roleID) values (6, 20);
insert into configuration.role_privileges (privID, roleID) values (6, 25);
insert into configuration.role_privileges (privID, roleID) values (6, 78);

-- switch to the new privilege
insert into configuration.role_privileges (privID, roleID)
  select 130, roleID from configuration.role_privileges where privID = 6;
insert into configuration.role_privileges (privID, roleID)
  select 131, roleID from configuration.role_privileges where privID = 5;

-- remove the known good starting state
delete from configuration.role_privileges where privID in (5, 6);
