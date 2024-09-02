import { TbMist } from 'react-icons/tb'
import { useState, useEffect } from 'react'
import { BsCloudHaze2Fill, BsCloudDrizzleFill } from 'react-icons/bs'
import { IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm } from 'react-icons/io'

import { api } from '../api/axios'
import { Card } from '../components/card'
import { Button } from '../components/button'
import { Loader } from '../components/loader'
import { CardTop } from '../components/cardTop'
import { CardBody } from '../components/cardBody'
import { CardBottom } from '../components/cardBottom'

const APIKey = import.meta.env.VITE_API_KEY

interface WeatherAPIData {
    main: {
        feels_like: number;
        humidity: number;
        pressure: number;
        temp: number;
        temp_max: number;
        tempo_min: number
    },
    name: string;
    sys: {
        country: string;
    },
    weather: Array<{
        main: string;
        description: string;
    }>,
    visibility: number;
    wind: {
        speed: number;
    }
}




export function App() {
    const [data, setData] = useState<WeatherAPIData | null>(null)
    const [location, setLocation] = useState('São paulo')

    // fetch api data
    useEffect(() => {
        api.get(`/weather?q=${location}&units=metric&lang=pt_br&appid=${APIKey}`).then(res => {
            setData(res.data)
        })
    }, [location])

    console.log(data)

    // Renderizando um componente de loading enquanto os dados não são retornados da API
    if (!data) {
        return (
            <Loader />
        )
    }


    let icon
    switch (data.weather[0].main) {
        case 'Clouds':
            icon = <IoMdCloudy />;
            break;
        case 'Haze':
            icon = <BsCloudHaze2Fill />;
            break;
        case 'Rain':
            icon = <IoMdRainy />;
            break;
        case 'Clear':
            icon = <IoMdSunny />;
            break;
        case 'Drizzle':
            icon = <BsCloudDrizzleFill />;
            break;
        case 'Snow':
            icon = <IoMdSnow />;
            break;
        case 'Thunderstorm':
            icon = <IoMdThunderstorm />;
            break;
        case 'Mist':
            icon = <TbMist />
            break;
    }

    const temperatureInCelcius = parseInt(data.main.temp.toFixed(0))
    const formatedFeelsLikeInCelcius = parseInt(data.main.feels_like.toFixed(0))
    const parsedVisibility = data.visibility / 1000


    return (
        <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0 gap-8'>
            <form className='h-16  bg-black/30 w-full max-w-md rounded-full backdrop-blur-2xl'>
                <div className='h-full relative flex items-center justify-between p-2'>

                    <input
                        type="text"
                        placeholder='Search by city or country'
                        className='flex-1 bg-transparent outline-none placeholder:text-white text-white font-light pl-6 h-full'
                    />

                    <Button>

                    </Button>
                </div>
            </form>


            <Card>
                <CardTop
                    icon={icon}
                    countryName={data.name}
                    countryAcronym={data.sys.country}
                />

                <CardBody
                    temp={temperatureInCelcius}
                    weatherDescription={data.weather[0].description}
                />

                <CardBottom
                    visibility={parsedVisibility}
                    feels_like={formatedFeelsLikeInCelcius}
                    humidity={data.main.humidity}
                    wind={data.wind.speed}
                />
            </Card>
        </div>

    )
}