import Button from "@mui/material/Button";
import React from "react";
import Card from '@mui/material/Card';
import {CardActions, CardContent, CardMedia} from "@mui/material";

export default function ACard({label, href, target, onClick = null, buttonText, title, img}) {
    return (
        <Card  sx={{ minWidth: 340, marginBottom: 2 }}>
            {img &&
                <CardMedia
                    component="img"
                    height="100"
                    image={img}
                    alt="survey img"
                    sx={{objectFit: 'contain'}}
                />
            }
            <CardContent>
                {title && <h1>{title}</h1>}
                {label && label}
            </CardContent>
            {buttonText &&
                <CardActions>
                    <Button variant="contained"
                            target={target}
                            href={href}
                            onClick={onClick}
                    >
                        {buttonText}
                    </Button>
                </CardActions>
            }
        </Card>
    )
}
