package com.inq.webcall.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;


public class SystemStatDao {

    private MongoDatabase db;
    private static SystemStatDao systemStatDao;

    private SystemStatDao() {
        db = MongoDBService.getInstance().getDBInstance();
    }

    public static SystemStatDao getInstance() {
        if (systemStatDao == null) {
            systemStatDao = new SystemStatDao();
        }
        return systemStatDao;
    }

    public void saveSystemStat(Document document) {
        MongoCollection<Document> roomlog = db.getCollection(IMongoDBService.TBL_SYSTEM_STAT);
        roomlog.insertOne(document);
    }
}
