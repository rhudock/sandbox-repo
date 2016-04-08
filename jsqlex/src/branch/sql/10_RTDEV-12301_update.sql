update `configuration`.`performance_metrics` set `metric_name` = "avgEngagementHandleTime" where `metric_name` = "avgChatDuration";
update `configuration`.`performance_metrics` set `metric_name` = "avgEngagementHandleTimeSLA" where `metric_name` = "avgChatDurationSLA";
