import React, { ReactElement, useMemo } from 'react';
import {
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Box,
  useMediaQuery,
} from '@mui/material';
import BigNumber from 'bignumber.js';
import { useTheme } from '@mui/material/styles';
import { BEAN, PODS } from '~/constants/tokens';
import useFarmerListingsLedger from '~/hooks/farmer/useFarmerListingsLedger';
import { FontSize, IconSize } from '~/components/App/muiTheme';
import { displayBN, displayFullBN, toStringBaseUnitBN, PlotMap } from '~/util';
import podIcon from '~/img/beanstalk/pod-icon.svg';
import Row from '~/components/Common/Row';

import { FC } from '~/types';
import { PlotFragment } from '.';
import SelectionItem from '../SelectionItem';
import { PodListing } from '~/state/farmer/market';

export interface PlotSelectProps {
  /** A farmer's plots */
  plots: PlotMap<BigNumber> | null;
  /** The beanstalk harvestable index */
  harvestableIndex: BigNumber;
  /** Custom function to set the selected plot index */
  handlePlotSelect: any;
  /** index of the selected plot */
  selected?: PlotFragment[] | string | PlotFragment | null;
  /** use multi select version? **/
  multiSelect?: boolean | undefined;
}

interface IRowContent {
  isMobile: boolean | null;
  index: string;
  harvestableIndex: BigNumber;
  listing: PodListing | null;
  plots: PlotMap<BigNumber>;
}

function RowContent({isMobile, index, harvestableIndex, listing, plots}: IRowContent): ReactElement {
  return (
    <Row justifyContent="space-between" sx={{ width: '100%' }}>
    <Row justifyContent="center">
      <ListItemIcon sx={{ pr: 1 }}>
        <Box
          component="img"
          src={podIcon}
          alt=""
          sx={{
            width: IconSize.tokenSelect,
            height: IconSize.tokenSelect,
          }}
        />
      </ListItemIcon>
      <ListItemText
        primary="PODS"
        primaryTypographyProps={{ color: 'text.primary', display: 'flex' }}
        secondary={
          <>
            {isMobile ? '@' : 'Place in Line:'}{' '}
            {displayBN(new BigNumber(index).minus(harvestableIndex))}
            {listing ? <>&nbsp;&middot; Currently listed</> : null}
          </>
        }
        sx={{ my: 0 }}
      />
    </Row>
    {plots[index] ? (
      <Typography variant="bodyLarge" sx={{ color: 'text.primary' }}>
        {displayFullBN(plots[index], PODS.displayDecimals)}
      </Typography>
    ) : null}
  </Row>
  );
}

const PlotSelect: FC<PlotSelectProps> = ({
  plots,
  harvestableIndex,
  handlePlotSelect,
  selected,
  multiSelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const farmerListings = useFarmerListingsLedger();
  const orderedPlotKeys = useMemo(() => {
    if (!plots) return null;
    /// float sorting is good enough here
    return Object.keys(plots).sort((a, b) => parseFloat(a) - parseFloat(b));
  }, [plots]);
  if (!plots || !orderedPlotKeys) return null;

  ///
  let numAlreadyListed = 0;
  const items = orderedPlotKeys.map((index) => {
    const id = toStringBaseUnitBN(index, BEAN[1].decimals);
    const listing = farmerListings[id];
    let isSelected: boolean;
    if (Array.isArray(selected)) {
      selected!.findIndex((item) => item.index == index) > -1
        ? (isSelected = true)
        : (isSelected = false);
    } else {
      selected ? (isSelected = true) : (isSelected = false);
    }
    if (listing) numAlreadyListed += 1;
    if (multiSelect) {
    return (
      <SelectionItem
        selected={isSelected}
        checkIcon="left"
        onClick={() => handlePlotSelect(index)}
        sx={{
          // ListItem is used elsewhere so we define here
          // instead of in muiTheme.ts
          '& .MuiListItemText-primary': {
            fontSize: FontSize['1xl'],
            lineHeight: '1.875rem',
          },
          '& .MuiListItemText-secondary': {
            fontSize: FontSize.base,
            lineHeight: '1.25rem',
            // color: BeanstalkPalette.lightGrey
          },
          mb: 1,
          '&:last-child': {mb: 0}
        }}
        >
          <RowContent
          isMobile={isMobile}
          index={index}
          harvestableIndex={harvestableIndex}
          listing={listing}
          plots={plots}
          />
      </SelectionItem>
    );
    } else {
    return (
      <ListItem
      key={index}
      color="primary"
      selected={isSelected}
      disablePadding
      onClick={() => handlePlotSelect(index)}
      sx={{
        // ListItem is used elsewhere so we define here
        // instead of in muiTheme.ts
        '& .MuiListItemText-primary': {
          fontSize: FontSize['1xl'],
          lineHeight: '1.875rem',
        },
        '& .MuiListItemText-secondary': {
          fontSize: FontSize.base,
          lineHeight: '1.25rem',
          // color: BeanstalkPalette.lightGrey
        },
      }}
    >
      <ListItemButton disableRipple>
        <RowContent
        isMobile={isMobile}
        index={index}
        harvestableIndex={harvestableIndex}
        listing={listing}
        plots={plots}
        />
      </ListItemButton>
    </ListItem>
    );
    }
  });

  return (
    <>
      {numAlreadyListed > 0 ? (
        <Box px={1}>
          <Typography color="text.secondary" fontSize="bodySmall">
            {/* * Currently listed on the Market. */}
            {/* FIXME: contextual message */}
          </Typography>
        </Box>
      ) : null}
      <List sx={{ p: 0 }}>{items}</List>
    </>
  );
};

export default PlotSelect;
