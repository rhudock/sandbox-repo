package com.packtpub.mongo.cookbook.data;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoDatabase;

import java.util.Arrays;

public class SchoolDBService {

    public static MongoDatabase db = DBService.client.getDatabase("school");

}
