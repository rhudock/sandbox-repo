/**
 * $\Id$
 * 
 * User: chealwoo
 * Date: Apr 7, 2010
 * Time: 9:19:43 AM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reserved.
 */
package com.cwl.model.user;


import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;

import com.cwl.model.BaseModel;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;


public class Account extends BaseModel {

	@NotNull
	@Size(min=1, max=25)
	private String name;

	@NotNull
	@NumberFormat(style= NumberFormat.Style.CURRENCY)
	private BigDecimal balance = new BigDecimal("1000");

	@NotNull
	@NumberFormat(style= NumberFormat.Style.PERCENT)
	private BigDecimal equityAllocation = new BigDecimal(".60");

	@DateTimeFormat(style="S-")
	@Future
	private Date renewalDate = new Date(new Date().getTime() + 31536000000L);


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public BigDecimal getEquityAllocation() {
		return equityAllocation;
	}

	public void setEquityAllocation(BigDecimal equityAllocation) {
		this.equityAllocation = equityAllocation;
	}

	public Date getRenewalDate() {
		return renewalDate;
	}

	public void setRenewalDate(Date renewalDate) {
		this.renewalDate = renewalDate;
	}

	public Long assignId() {
		super.setId(idSequence.incrementAndGet());
		return super.getId();
	}

	private static final AtomicLong idSequence = new AtomicLong();

}