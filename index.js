import {createClient} from '@supabase/supabase-js'
import * as data from './info.json' assert {type: "json"} 

const supabase = createClient(process.env.DB_url, process.env.DB_anon);

main()

async function main() {
    const access_token = await getAccessToken()

    const info = data.default
    console.log(info)
    console.log(info.length)
    console.log(access_token)
    fetchTopFives(info, access_token.access_token)
}


async function getAccessToken() {

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            body: `grant_type=client_credentials&client_id=${process.env.spotify_id}&client_secret=${process.env.spotify_token}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        }).then(response => response.json().then(res1 => { return res1 }))

        return response
    } catch {
        console.log("Failed to fetch access token")
    }
} 

async function fetchTopFives(countryList, access_token) {
    
    const bulkRows = []

    for (let i = 0; i < countryList.length; i++) {
        
        if (countryList[i].playlist_id != null) {
            const playlist_id = countryList[i].playlist_id
            const songData = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=5`, {
                headers:  {
                    Authorization: `Bearer ${access_token}`
                }
            })
            .then(response => response.json()
            .then(json => {return json}))

            const {items} = songData;
            console.log(items)
            const row = {
                "country": countryList[i].country,
                "songone": items[0],
                "songtwo": items[1],
                "songthree": items[2],
                "songfour": items[3],
                "songfive": items[4]
            }

            bulkRows.push(row)
        } else {
            continue
        }
    }

    const { error } = await supabase
        .from('history')
        .insert(bulkRows)

}

