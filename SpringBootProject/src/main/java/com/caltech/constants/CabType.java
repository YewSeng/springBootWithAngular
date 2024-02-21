package com.caltech.constants;

public enum CabType {

	STANDARD("Standard Taxi"),
	PREMIUM("Premium Taxi"),
	LIMOUSINE("Limousine Taxi"),
	SPECIAL("Wheelchair-Accessible Taxis");
	
	private String customName;

	private CabType(String customName) {
		this.customName = customName;
	}

	public String getCustomName() {
		return customName;
	}
}
