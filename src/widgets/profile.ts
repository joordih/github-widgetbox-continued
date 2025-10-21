require('dotenv').config()
import axios from 'axios'
import { getTheme, requestInBase64 } from '../utils'
import errorWidget from './error'
import buildCard from '../components/card'
import GithubUserRequest from '../interfaces/GithubUser'
import getGithubUserStats from '../fetchers/user-stats-fetcher'
import { Repository } from '../interfaces/Repositories'
import { Theme } from '../interfaces/Theme'
import themes from '../data/themes'

export default async function profileWidget(
    username: string,
    data: string,
    themeString?: string
): Promise<string> {
    let theme: Theme = getTheme(themes, 'default')
    if (themeString) theme = getTheme(themes, themeString)
    if (!theme) theme = getTheme(themes, 'default')

    const dataOptions: Array<string> = data.split(',')
    if (dataOptions === undefined) {
        return errorWidget('Profile', '-25%', 'Data option is missing!', '-25%')
    }
    if (dataOptions.length > 4) {
        return errorWidget(
            'Profile',
            '-25%',
            `Can't have more than 4 data-options!`,
            '-40%'
        )
    }

    const width = 842
    const height = 165

    async function getDataOptions(): Promise<string> {
        let dataBoxes = ''
        const profile: GithubUserRequest = await getGithubUserStats(
            process.env.GITHUB_TOKEN,
            username
        )
        const stargazers: number[] = []
        profile.data.user.repositories.nodes.forEach(
            (repo: Repository, index) => {
                stargazers[index] = repo.stargazers.totalCount
            }
        )

        for (let i = 0; i < dataOptions.length; i++) {
            switch (dataOptions[i].toLowerCase()) {
                case 'followers':
                    addDataBox(
                        'followers',
                        i,
                        profile.data.user.followers.totalCount,
                        '#CAF0FF',
                        '#00C6FF',
                        'M3.625,9.5A2.417,2.417,0,1,0,1.208,7.084,2.419,2.419,0,0,0,3.625,9.5Zm16.919,0a2.417,2.417,0,1,0-2.417-2.417A2.419,2.419,0,0,0,20.544,9.5Zm1.208,1.208H19.336a2.41,2.41,0,0,0-1.7.7,5.524,5.524,0,0,1,2.836,4.132h2.493a1.207,1.207,0,0,0,1.208-1.208V13.126A2.419,2.419,0,0,0,21.753,10.709Zm-9.668,0a4.23,4.23,0,1,0-4.23-4.23A4.228,4.228,0,0,0,12.085,10.709Zm2.9,1.208h-.313a5.84,5.84,0,0,1-5.174,0H9.185a4.352,4.352,0,0,0-4.351,4.351v1.088a1.813,1.813,0,0,0,1.813,1.813H17.523a1.813,1.813,0,0,0,1.813-1.813V16.269A4.352,4.352,0,0,0,14.985,11.918Zm-8.448-.506a2.41,2.41,0,0,0-1.7-.7H2.417A2.419,2.419,0,0,0,0,13.126v1.208a1.207,1.207,0,0,0,1.208,1.208H3.7A5.538,5.538,0,0,1,6.537,11.412Z'
                    )
                    break
                case 'repositories':
                    addDataBox(
                        'repositories',
                        i,
                        profile.data.user.repositories.totalCount,
                        '#FFCEE4',
                        '#FF0774',
                        'M7.106,3A2.106,2.106,0,0,0,5,5.106V17.74a.7.7,0,0,0,.207.5,2.026,2.026,0,0,0,1.9,1.608h.7v-1.4h-.7a.7.7,0,0,1,0-1.4H17.634a1.4,1.4,0,0,0,1.4-1.4V4.4a1.4,1.4,0,0,0-1.4-1.4Zm.7,2.106h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,5.106Zm0,3.51h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,8.615Zm0,3.51h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,12.125Zm1.4,6.317v3.51l2.106-1.4,2.106,1.4v-3.51Zm5.615,0v1.4h3.51a.7.7,0,0,0,0-1.4Z'
                    )
                    break
                case 'stars':
                    addDataBox(
                        'stars',
                        i,
                        stargazers.reduce((a, b) => a + b, 0),
                        '#FFEFCD',
                        '#FFA100',
                        'M9.6.608,7.369,5.131l-4.992.728a1.094,1.094,0,0,0-.6,1.865l3.611,3.519L4.53,16.215a1.093,1.093,0,0,0,1.585,1.151l4.465-2.347,4.465,2.347a1.094,1.094,0,0,0,1.585-1.151l-.854-4.971,3.611-3.519a1.094,1.094,0,0,0-.6-1.865l-4.992-.728L11.561.608A1.094,1.094,0,0,0,9.6.608Z'
                    )
                    break
                case 'contributions':
                case 'commits':
                    addDataBox(
                        'contributions',
                        i,
                        profile.data.user.contributionsCollection
                            .contributionCalendar.totalContributions,
                        '#C5FFD9',
                        '#00F14F',
                        `<g transform="translate(-71 9)">
              <path d="M0,0H20.592V20.592H0Z" fill="none"/>
              <path d="M12.438,14.87v5.148H10.722V14.87H8.148l3.432-4.29,3.432,4.29Zm1.716,1.716h2.574V14.012h-.686L11.58,8.435,6.987,14.012H6a1.287,1.287,0,0,0,0,2.574h3V18.3H6a3,3,0,0,1-3-3V4.574A2.574,2.574,0,0,1,5.574,2H17.586a.858.858,0,0,1,.858.858V17.444a.858.858,0,0,1-.858.858H14.154ZM6.432,4.574V6.29H8.148V4.574Zm0,2.574V8.864H8.148V7.148Z" transform="translate(-0.426 -0.284)" fill="#00F14F"/>
            </g>`
                    )
                    break
                default:
                    return errorWidget(
                        'Profile',
                        '-25%',
                        `Invalid data item found!`,
                        '-26%'
                    )
            }
        }

        function addDataBox(
            name: string,
            index: number,
            count: number,
            color1: string,
            color2: string,
            svg: string
        ) {
            dataBoxes += `<g id="${name}" transform="translate(${
                (dataOptions.length - 1 - index) * -108
            } 0)">
        <rect id="${name}-box" width="90" height="37" rx="18.5" transform="translate(-90 0)" fill="${color1}"/>
        <text id="${name}-text" transform="translate(${
                name === 'followers' ? '-43' : '-47'
            } 25)" fill="${color2}" font-size="16" font-family="Roboto-Regular, Roboto, sans-serif">
          <tspan x="0" y="0">${count}</tspan>
        </text>
        ${
            name !== 'commits' && name !== 'contributions'
                ? `<path transform="translate(-71 ${
                      name === 'stars' ? '10' : '8'
                  })" fill="${color2}" d="${svg}"/>`
                : svg
        }
      </g>`
        }
        return dataBoxes
    }

    try {
        const dataBoxes = await getDataOptions()
        const response = await axios.get(
            `https://api.github.com/users/${username}`
        )
        const avatar = await requestInBase64(response.data.avatar_url)

        return `return <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        @media (prefers-color-scheme: dark) {
          .bg { fill: #0f172a; }
          .title { fill: #f1f5f9; }
          .subtitle { fill: #cbd5e1; }
        }
        @media (prefers-color-scheme: light) {
          .bg { fill: #f8fafc; }
          .title { fill: #0f172a; }
          .subtitle { fill: #64748b; }
        }
      </style>
      ${buildCard(width, height, 'none')}
      <rect class="bg" width="${width}" height="${height}" rx="12"/>
      <g transform="translate(52 47)">
        <defs>
          <pattern id="pattern" width="100%" height="100%">
            <image width="65" height="65" xlink:href="data:image/jpeg;base64,${avatar}"/>
          </pattern>
        </defs>
        <rect width="65" height="65" rx="30" fill="url(#pattern)"/>
      </g>
      <text class="title" transform="translate(145 78)" font-size="26" font-family="Roboto-Medium, Roboto, sans-serif" font-weight="500">${
          response.data.name ?? response.data.login
      }</text>
      <text class="subtitle" transform="translate(145 102)" font-size="16" font-family="Roboto-Regular, Roboto, sans-serif">GitHub.com/${
          response.data.login
      }</text>
      <g transform="translate(${width - 52} ${
            (height - 37) / 2
        })">${dataBoxes}</g>
    </svg>`
    } catch (error) {
        return errorWidget('Profile', '-25%', 'GitHub API-call error!', '-24%')
    }
}
