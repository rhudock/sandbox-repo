<xsl:stylesheet	
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:template match="/Inventory">
		<html><head><title>Zoo Inventory</title></head>
		<body><h1>Zoo Inventory</h1>
		<table border="1">
		<tr><td><b>Name</b></td><td><b>Species</b></td>
		<td><b>Habitat</b></td><td><b>Temperament</b></td>
		<td><b>Diet</b></td></tr>
			<xsl:apply-templates/><!-- Process Inventory -->
		</table>
		</body>
		</html>
	</xsl:template>
	<xsl:template match="Inventory/Animal">
		<tr><td><xsl:value-of select="Name"/></td>
		    <td><xsl:value-of select="Species"/></td>
			<td><xsl:value-of select="Habitat"/></td>
			<td><xsl:value-of select="Temperament"/></td> 
			<td><xsl:apply-templates select="Food|FoodRecipe"/>
				<!-- Process Food,FoodRecipe--></td></tr>
	</xsl:template>

	<xsl:template match="FoodRecipe">
		<table>
		<tr><td><em><xsl:value-of select="Name"/></em></td></tr>
		<xsl:for-each select="Ingredient">
			<tr><td><xsl:value-of select="."/></td></tr>
		</xsl:for-each>
		</table>
	</xsl:template>

</xsl:stylesheet>
