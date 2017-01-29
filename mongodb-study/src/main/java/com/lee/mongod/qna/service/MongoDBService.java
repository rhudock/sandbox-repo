package com.lee.mongod.qna.service;

import com.google.gson.JsonArray;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoDatabase;
import org.kurento.jsonrpc.JsonUtils;

import java.util.LinkedList;
import java.util.List;

import static org.kurento.commons.PropertiesManager.getPropertyJson;

public class MongoDBService implements IMongoDBService {

    private MongoClient mongo;
    private MongoDatabase db;
    private static MongoDBService mongoDBService;

    private MongoDBService() {
        List<ServerAddress> mongoSrvAddrList = new LinkedList<ServerAddress>();

        mongoSrvAddrList.add(new ServerAddress("192.168.137.189", 27017));

        this.mongo = new MongoClient(mongoSrvAddrList);
        db = mongo.getDatabase("kmslog");

    }

    public static MongoDBService getInstance() {
        if (mongoDBService == null) {
            mongoDBService = new MongoDBService();
        }
        return mongoDBService;
    }

    public MongoDatabase getDBInstance() {
        return getInstance().db;
    }
}
