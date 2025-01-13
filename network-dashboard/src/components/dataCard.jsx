import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const DataCard = ({ title, value }) => {
  return (
    <Card className="shadow-md">
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DataCard;
