import {createClient} from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(process.env.DB_url, process.env.DB_anon);

//get access token 

main()

async function main() {
    const access_token = await getAccessToken()

    console.log(access_token)
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


// console.log(markets.json())

// const data = await fetch("https://api.spotify.com/v1/playlists/37i9dQZEVXbKj23U1GF4IR/tracks?market=CA", {
//     headers: {
//         Authorization: `Bearer ${access_token}`
//     }
// })

// console.log(data.json())
