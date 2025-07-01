import React, { useContext } from 'react'
import { ContextApi } from '../../context/ContextApi'

const HeroSection = () => {
  const {user} = useContext(ContextApi)
  return (
    <div>{user?.name}    ----Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita itaque alias illo quo sequi aliquam, est, sapiente quasi enim eligendi tempora magnam.</div>
  )
}

export default HeroSection