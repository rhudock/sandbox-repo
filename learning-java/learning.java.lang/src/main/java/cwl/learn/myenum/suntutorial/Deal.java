/**
 * \$Id$
 * Deal
 * Version: DLee
 * Date: Mar 6, 2009  Time: 2:34:27 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package cwl.learn.myenum.suntutorial;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deal {

   public static ArrayList<Card> deal(List<Card> deck, int n) {
      int deckSize = deck.size();
      List<Card> handView = deck.subList(deckSize - n, deckSize);
      ArrayList<Card> hand = new ArrayList<Card>(handView);
      handView.clear();
      return hand;
   }

   public static void main(String args[]) {
      int numHands;
      int cardsPerHand;

      List<Card> deck = Card.newDeck();

      if (args.length > 0) {
         numHands = Integer.parseInt(args[0]);
         cardsPerHand = Integer.parseInt(args[1]);
      } else {
         numHands = 4;
         cardsPerHand = 5;
      }

      Collections.shuffle(deck);
      for (int i = 0; i < numHands; i++) {
         System.out.println(deal(deck, cardsPerHand));
      }
   }

}

/**
 * Output 
 [JACK of HEARTS, FOUR of HEARTS, NINE of SPADES, SIX of HEARTS, EIGHT of CLUBS]
 [ACE of SPADES, THREE of HEARTS, EIGHT of HEARTS, SEVEN of DIAMONDS, KING of DIAMONDS]
 [NINE of DIAMONDS, NINE of CLUBS, QUEEN of SPADES, EIGHT of DIAMONDS, DEUCE of DIAMONDS]
 [SIX of CLUBS, ACE of HEARTS, DEUCE of HEARTS, FIVE of HEARTS, FOUR of DIAMONDS]
 */
