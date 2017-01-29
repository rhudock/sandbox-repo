package com.packtpub.mongo.cookbook.data;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

import java.util.Arrays;

/**
 * Created by chealwoo on 1/26/2017.
 */
public class DBService {

    public static MongoClient client = new MongoClient(Arrays.asList(new ServerAddress("localhost", 27017)));

}
