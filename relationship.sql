ALTER TABLE inventory
ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id)
REFERENCES classification (classification_id)
ON UPDATE CASCADE
ON DELETE NO ACTION;

