package com.inq.flash.agent.utils {
import com.inq.flash.agent.transferconference.Agent;
import com.inq.flash.agent.transferconference.QueueInfo;
import com.inq.flash.agent.transferconference.BUnitAttribute;
import com.inq.flash.agent.transferconference.SelectedAttribute;

import com.inq.flash.messagingframework.Participant;
import flash.utils.Dictionary;

import mx.collections.ArrayCollection;

public class TCUtils {
    //Return all bUnit agents
    public static function getBUnitAgents(queueKey:QueueInfo):ArrayCollection {
        var attribute:BUnitAttribute;
        var allBUnitAgents:Dictionary = new Dictionary();
        var attributes:ArrayCollection = queueKey.transferBUnitAttributes;
        var tempAgent:Agent;
        var tempAgentAttributes:ArrayCollection;
        var agent:Agent;
        var agents:ArrayCollection;
        var attributevalue2agent:Dictionary;
		if (attributes != null) {
			for (var i:int = 0; i < attributes.length; i ++) {
				attribute = BUnitAttribute(attributes.getItemAt(i));
				attributevalue2agent = attribute.attrValue2Agent;
				if (attributevalue2agent != null) {
					for (var attrValue:String in attributevalue2agent) {
						agents = attributevalue2agent[attrValue];
						if (agents != null) {
							for (var j:int = 0; j < agents.length; j++) {
								agent = agents.getItemAt(j) as Agent;
								if (allBUnitAgents[agent.agentID] == null) {
									allBUnitAgents[agent.agentID] = agent;
								}
								tempAgent = allBUnitAgents[agent.agentID];
								if (tempAgent.bUnitAttributes == null) {
									tempAgent.bUnitAttributes = new ArrayCollection();
								}
								tempAgentAttributes = tempAgent.bUnitAttributes;
								tempAgentAttributes.addItem(attrValue);
							}
						}
					}
				}
			}
		}
        agents = new ArrayCollection();
        for (var agentID:String in allBUnitAgents) {
            agents.addItem(allBUnitAgents[agentID]);
        }
        return agents;
    }

    public static function getSelectedAttribute(attribute: BUnitAttribute, selectedAttributes:ArrayCollection):SelectedAttribute {
        var selectedAttribute:SelectedAttribute;
        for (var i:int = 0; i < selectedAttributes.length; i ++) {
            selectedAttribute = SelectedAttribute(selectedAttributes.getItemAt(i));
            if (selectedAttribute.attrName == attribute.name) {
                for (var attrValue:String in attribute.attrValue2Agent) {
                    if (attrValue == selectedAttribute.attrValue) {
                        return new SelectedAttribute(attrValue, attribute.name, true);
                    }
                }
                return new SelectedAttribute(selectedAttribute.attrValue, attribute.name, false);
            }
        }
        return null;
    }

    //Return agents filtered by selected attributes
    public static function getAgents(selectedAttributes: ArrayCollection, queueInfo: QueueInfo):ArrayCollection {
        if (selectedAttributes == null || selectedAttributes.length == 0) {
            return new ArrayCollection();
        }
        var agents:ArrayCollection = getBUnitAgents(queueInfo);
        var attribute:BUnitAttribute;
        for (var i:int = 1; i < selectedAttributes.length; i ++) {
            attribute = getTransferBUnitAttributeByAttrName(queueInfo.transferBUnitAttributes, SelectedAttribute(selectedAttributes[i]).attrName);
			//"attribute.attrValue2Agent" can be null when all Agents with such attribute values logged out
			if (attribute != null && attribute.attrValue2Agent != null) {
				intersectAgentCollection(agents, attribute.attrValue2Agent[SelectedAttribute(selectedAttributes[i]).attrValue]);
  			}
        }
        var tempAgents:ArrayCollection = new ArrayCollection();
        for (i = 0; i < agents.length; i ++) {
            if (agents[i] != null) {
                tempAgents.addItem(agents[i]);
            }
        }
        return tempAgents;
    }

    public static function getTransferBUnitAttributeByAttrName(transferBUnitAttributes:ArrayCollection, attrName:String):BUnitAttribute {
        if (transferBUnitAttributes != null) {
			for (var i:int = 0; i < transferBUnitAttributes.length; i++) {
				if (BUnitAttribute(transferBUnitAttributes[i]).name == attrName) {
					return transferBUnitAttributes[i];
				}
			}
		}
        var newBUnitAttribute:BUnitAttribute = new BUnitAttribute(attrName);
        transferBUnitAttributes.addItem(newBUnitAttribute);
        return newBUnitAttribute;
    }

    public static function intersectAgentCollection(source:ArrayCollection, target:ArrayCollection):void {
        var found:Boolean;
        for (var i:int = 0; i < source.length; i ++) {
            found = false;
            if (target != null) {
                for (var j:int = 0; j < target.length; j ++) {
                    if (source[i] != null && Agent(source[i]).agentID == Agent(target[j]).agentID) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                source[i] = null;
            }
        }
    }

    public static function isEmpryCollection(collection:ArrayCollection):Boolean {
        if (collection == null || collection.length == 0) {
            return true;
        }
        for (var i:int = 0; i < collection.length; i++) {
            if (collection[i] != null) {
                return false;
            }
        }
        return true;
    }

    public static function isAgentChatParticipant(agent:Agent, participants:ArrayCollection):Boolean {
        if (agent == null || participants == null || participants.length == 0) {
            return false;
        }
        for (var i:int = 0; i < participants.length; i++) {
            if (Participant(participants[i]).getID() == agent.agentID) {
                return true;
            }
        }
        return false;
    }
}
}