update `configuration`.`performance_metrics` set `metric_name` = "avgChatDuration" where `metric_name` = "avgEngagementHandleTime";
update `configuration`.`performance_metrics` set `metric_name` = "avgChatDurationSLA" where `metric_name` = "avgEngagementHandleTimeSLA";
