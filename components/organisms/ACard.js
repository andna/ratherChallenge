import Button from "@mui/material/Button";
import React from "react";
import Card from '@mui/material/Card';
import {CardActions, CardContent, CardMedia, Typography} from "@mui/material";

export default function ACard({
    label,
    href,
    target,
    onClick = null,
    buttonText,
    title,
    img,
    imgStyle,
    children,
    disabled,
    hint
  }) {


    return (
        <Card sx={{minWidth: 340, marginBottom: 2}}>
            {img &&
                <CardMedia
                    component="img"
                    height="100"
                    image={img}
                    alt="survey img"
                    sx={imgStyle}
                />
            }
            <CardContent>
                {title && <h1>{title}</h1>}
                {label}
                {children}
            </CardContent>
            {buttonText &&
                <CardActions>
                    {hint &&
                        <Typography fontSize={12} p={1} className={hint.style}>
                            {hint.text}
                        </Typography>
                    }
                    <Button variant="contained"
                            target={target}
                            href={href}
                            onClick={onClick}
                            disabled={disabled}
                            sx={{marginLeft: "auto"}}
                    >
                        {buttonText}
                    </Button>
                </CardActions>
            }
        </Card>
    )
}
