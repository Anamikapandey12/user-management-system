
CREATE TABLE IF NOT EXISTS user(
id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50 ) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);
INSERT INTO `user`(id,username,email,password)
    VALUES
    ("234G","AmanH","aman@gmailC.com","456e");


ALTER TABLE user
ADD COLUMN new_id INT NOT NULL AUTO_INCREMENT UNIQUE;



ALTER TABLE `user`
DROP PRIMARY KEY;






    
