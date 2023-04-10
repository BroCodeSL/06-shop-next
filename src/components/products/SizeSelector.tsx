import { FC } from "react";
import { Box, Button } from "@mui/material";

import { ISize } from "@/interfaces";

type Props = {
  selectSize?: ISize;
  sizes: ISize[];
  onSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({ selectSize, sizes, onSelectedSize }) => {
  return (
    <Box>
      {
        sizes.map( size => (
          <Button
            key={ size }
            size='small'
            color={ selectSize === size ? 'primary' : 'info' }
            onClick={() => onSelectedSize(size)}
          >
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
