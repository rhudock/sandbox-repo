package com.lee.mongod.qna;

import com.lee.mongod.qna.service.IMongoDBService;
import com.lee.mongod.qna.service.MongoDBService;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import static com.mongodb.client.model.Projections.excludeId;
import static com.mongodb.client.model.Sorts.ascending;
import static com.mongodb.client.model.Sorts.descending;

/**
 * Created by chealwoo on 12/29/2016.
 */
public class BasicEx {
    private static MongoDatabase db = MongoDBService.getInstance().getDBInstance();


    public static FindIterable<Document> buildReadCallEndpointDetail(String callId) {

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("room", callId);

        return readCallEndpointDetail(searchQuery);
    }

    public static FindIterable<Document> readCallEndpointDetail(BasicDBObject searchQuery) {
        MongoCollection<Document> collection = db.getCollection(IMongoDBService.TBL_WEBRTCENDPOINT_STAT);

        FindIterable<Document> cursor = collection.find(searchQuery);

        for (Document d : cursor) {
            System.out.println(d);
        }

        return cursor;
    }

    public static void main(String[] args) {
        buildReadCallEndpointDetail("ltttest0010");
    }
}
