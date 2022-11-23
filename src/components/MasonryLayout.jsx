import React from 'react'
import Masonry from 'react-masonry-css';
import Pins from '../container/Pins';
// single pin that we will loop ..just like ListView builder or gridView builder
import Pin from './Pin';

// so here we create a breakPoint..to encode how many items will show per grid o per line...just like flutter we can set the grid count or whatever its called
// you can use any value but this works best...

// so for screenSize of 3000 show 6 on a grid..2000 screenSize show 5 e.t.c
const breakPointObj={
  default:4,
  3000:6,
  2000:5,
  1200:3,
  1000:2,
  500:1
}

const MasonryLayout = ({pins}) => {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakPointObj}>
      {pins?.map((pin)=><Pin pin={pin} key={pin._id} className='w-max'/>)}
    </Masonry>
  )
}

export default MasonryLayout