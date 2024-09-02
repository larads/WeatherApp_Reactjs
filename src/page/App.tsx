import { TbMist } from 'react-icons/tb'
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect, FormEvent } from 'react'
import { BsCloudHaze2Fill, BsCloudDrizzleFill } from 'react-icons/bs'
import { IoMdSunny, IoMdRainy, IoMdSnow, IoMdThunderstorm } from 'react-icons/io'

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
    const [inputValue, setInputValue] = useState('')
    const [animate, setAnimate] = useState(false)


    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (inputValue.trim().length !== 0) {
            setLocation(inputValue)

            setInputValue('')
        } else {
            setAnimate(true)

            toast.error('Preencha o campo antes de realizar a pesquisa')

            setTimeout(() => {
                setAnimate(false)
            }, 500);
        }
    }

    // fetch api data
    useEffect(() => {
        api.get(`/weather?q=${location}&units=metric&lang=pt_br&appid=${APIKey}`).then(res => {
            setData(res.data)
        }).catch(() => {
            return toast.error('Cidade não encontrada')
        })
    }, [location])

    // Renderizando um componente de loading enquanto os dados não são retornados da API
    if (!data) {
        return (
            <div className='bg-blue-950'>
                <Loader />
            </div>
        )
    }



    let icon
    switch (data.weather[0].main) {
        case 'Clouds':
            icon = <IoMdRainy className='text-blue-400' />;
            break;
        case 'Haze':
            icon = <BsCloudHaze2Fill className='text-yellow-300' />;
            break;
        case 'Rain':
            icon = <IoMdRainy className='text-blue-400' />;
            break;
        case 'Clear':
            icon = <IoMdSunny className='text-yellow-300' />;
            break;
        case 'Drizzle':
            icon = <BsCloudDrizzleFill className='text-blue-400' />;
            break;
        case 'Snow':
            icon = <IoMdSnow className='text-blue-200' />;
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
    const convertMetersPerSecond = parseInt((data.wind.speed * 3.6).toFixed(1))


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className='w-full h-screen bg-blue-950 bg-no-repeat bg-cover flex flex-col items-center justify-center px-4 lg:px-0 gap-10'>
                <form
                    className={`${animate ? 'animate-shake' : 'animate-none'} h-16 bg-black/30 w-full max-w-md rounded-full backdrop-blur-2xl  drop-shadow-lg`}
                >
                    <div className='h-full relative flex items-center justify-between p-2'>

                        <input
                            type="text"
                            className='flex-1 bg-transparent outline-none placeholder:text-white text-white font-light pl-6 h-ful'
                            placeholder='Search by city or country'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        <Button
                            onClick={(e) => handleSubmit(e)}
                        />
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
                        wind={convertMetersPerSecond}
                    />
                </Card>

            </div>
        </>
    )
}