package com.lee.mongod.qna;

import com.lee.mongod.qna.service.IMongoDBService;
import com.lee.mongod.qna.service.MongoDBService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

/**
 * Created by chealwoo on 12/29/2016.
 */
public class ProjectionEx {
    private static MongoDatabase db = MongoDBService.getInstance().getDBInstance();


    public static FindIterable<Document> buildReadCallEndpointDetail() {
        Document documentKms = new Document();

        MongoCollection<Document> kmslog = db.getCollection(IMongoDBService.TBL_KMS_STAT);

        BasicDBObject searchQuery = new BasicDBObject();
        BasicDBObject projection = new BasicDBObject();

        FindIterable<Document> cursor = kmslog.find(searchQuery);

        projection.put("_id", 0);
        projection.put("timeStamp", 1);
        projection.put("NumWebRtcEndpoints", 1);
        projection.put("InboundByteCount", 1);
        projection.put("InboundPacketLostCount", 1);
        cursor.projection(projection);

        for (Document d : cursor) {
            System.out.println(d);
        }

        return cursor;
    }

    public static void main(String[] args) {
        buildReadCallEndpointDetail();
    }
}
