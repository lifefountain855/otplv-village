export default function Logo({size="400",glow=true, glowColor="#fff", glowSize="2", backgroundColor="#0a0a0a", backgroundRadius="0", pathOptions}){
    const paths = [
        "M 73.6 65 A 1 1 0 0 0 29.241 73.503 C 34.511 97.795 67.466 99.007 73.6 74",
        "M 22 11.3 L 51.65 56 L 81.045 11.3",
        "M 51.537 84 C 47 77 36 76 36 67 C 35 57 49 55 51.547 63.418 C 54 55 69 57 68 67 C 68 76 57 77 51.537 84",
        "M 17.453 17.037 V 69.279 H 45 V 67.671 L 47.862 69.279 L 45 70.8 V 69.279",
    ]
    for (let i of pathOptions){
        if (!i?.fill) i.fill="none"
        if (!i?.stroke) i.stroke="#000"
        if (!i?.strokeWidth) i.strokeWidth="4"
        if (!i?.strokeLinecap) i.strokeLineCap="butt"
        if (!i?.glow) i.glow="url(#glow)"
    }
    
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100">
            {glow && (<defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation={glowSize} result="blur" />
                    <feFlood floodColor={glowColor} result="glowColor" />
                    <feComposite in="glowColor" in2="blur" operator="in" result="coloredBlur" />

                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>)}

            <rect width="100" height="100" rx={backgroundRadius} fill={backgroundColor}/>

            {paths.map((path,i)=>(
                <path key={`path_${i}`} d={path} fill={pathOptions[i]?.fill} stroke={pathOptions[i]?.stroke} strokeWidth={pathOptions[i]?.strokeWidth} strokeLinecap={pathOptions[i]?.strokeLinecap} filter={glow?pathOptions[i]?.glow??"url(#glow)":""}/>
            ))}
        </svg>
    )
}