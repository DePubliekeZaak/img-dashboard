import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

# Gemeentegrenzen van Nederland inladen
gemeentegrenzen = gpd.read_file("https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wfs?" 
                                "service=WFS&version=2.0.0&request=GetFeature&typeName=bestuurlijkegrenzen:gemeenten&outputFormat=application/json")

# Data met toekenningen
data = {
    "Groningen": 59877,
    "Midden-Groningen": 21681,
    "Eemsdelta": 20384,
    "Het Hogeland": 19606,
    "Oldambt": 10921,
    "Westerkwartier": 9623,
    "Veendam": 8532,
    "Tynaarlo": 5915,
    "Noordenveld": 4713,
    "Pekela": 2004,
    "Aa en Hunze": 1034,
    "Noardeast-Fryslân": 254,
    "Assen": 236,
    "Westerwolde": 192,
    "Achtkarspelen": 51,
    "Stadskanaal": 43,
    "Ooststellingwerf": 39
}

# Dataframe maken
df = pd.DataFrame(data.items(), columns=["gemeentenaam", "toekenningen"])

# Merge gemeentegrenzen met toekenningen
gemeentegrenzen = gemeentegrenzen.merge(df, left_on="gemeentenaam", right_on="gemeentenaam", how="left")

# Kaart plotten
fig, ax = plt.subplots(1, 1, figsize=(8, 10))
gemeentegrenzen.boundary.plot(ax=ax, linewidth=0.5, color="black")  # Gemeentegrenzen
gemeentegrenzen.plot(column="toekenningen", ax=ax, cmap="OrRd", legend=True, edgecolor="black")

ax.set_title("Aantal Toekenningen per Gemeente")
ax.set_axis_off()

# Opslaan en tonen
kaart_path = "toekenningen_kaart.png"
plt.savefig(kaart_path, dpi=300)
plt.show()

kaart_path
