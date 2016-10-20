package com.dcmi.template.spring.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

/**
 * User: chealwoo
 * Date: Jan 26, 2010
 * Time: 2:50:17 PM
 * $Id$
 * Copyright (c) Docomo interTouch 2010, All rights reserved.
 */
@ResponseStatus(value= HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

	private Long resourceId;

	public ResourceNotFoundException(Long resourceId) {
		this.resourceId = resourceId;
	}

	public Long getResourceId() {
		return resourceId;
	}

}
