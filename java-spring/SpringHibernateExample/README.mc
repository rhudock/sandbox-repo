Example from 
http://websystique.com/springmvc/spring-4-mvc-and-hibernate4-integration-example-using-annotations/

###1 Build Table in your DB
CREATE TABLE EMPLOYEE(
    id INT NOT NULL auto_increment, 
    name VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    salary DOUBLE NOT NULL,
    ssn VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


###2. To Run this project locally
```shell
$ mvn jetty:run
```

Access ```http://localhost:8080/SpringHibernateExample```