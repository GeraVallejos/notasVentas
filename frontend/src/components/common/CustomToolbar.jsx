import {
    Toolbar,
    QuickFilter,
    QuickFilterControl,
    QuickFilterClear,
    ToolbarButton,
    QuickFilterTrigger,
} from "@mui/x-data-grid";
import {
    Box,
    Button,
    InputAdornment,
    styled,
    TextField,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";


const CustomToolBar = ({ onExport }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    const StyledQuickFilter = styled(QuickFilter)({
        display: 'grid',
        alignItems: 'center',
        marginLeft: 'auto',
    });

    const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        width: 'min-content',
        height: 'min-content',
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? 'none' : 'auto',
        transition: theme.transitions.create(['opacity']),
    }));

    const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        overflowX: 'clip',
        width: ownerState.expanded ? 260 : 'var(--trigger-width)',
        opacity: ownerState.expanded ? 1 : 0,
        transition: theme.transitions.create(['width', 'opacity']),
    }));

    return (
        <Toolbar>
            <StyledQuickFilter>
                {isSmallScreen && (
                <QuickFilterTrigger
                    render={(triggerProps, state) => (
                        <Tooltip title="Buscar" enterDelay={0}>
                            <StyledToolbarButton
                                {...triggerProps}
                                ownerState={{ expanded: state.expanded }}
                                color="default"
                                aria-disabled={state.expanded}
                            >
                                <SearchIcon fontSize="small" />
                            </StyledToolbarButton>
                        </Tooltip>
                    )}
                />
                )}
                <QuickFilterControl
                    render={({ ref, ...controlProps }, state) => (
                        <StyledTextField
                            {...controlProps}
                            ownerState={{ expanded: !isSmallScreen || state.expanded }}
                            inputRef={ref}
                            aria-label="Buscar"
                            placeholder="Buscar..."
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: state.value ? (
                                        <InputAdornment position="end">
                                            <QuickFilterClear
                                                edge="end"
                                                size="small"
                                                aria-label="Limpiar Busqueda"
                                                material={{ sx: { marginRight: -0.75 } }}
                                            >
                                                <CancelIcon fontSize="small" />
                                            </QuickFilterClear>
                                        </InputAdornment>
                                    ) : null,
                                    ...controlProps.slotProps?.input,
                                },
                                ...controlProps.slotProps,
                            }}
                        />
                    )}
                />
            </StyledQuickFilter>

            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Exportar">
                <Button
                    onClick={onExport}
                    startIcon={<SaveAltIcon />}
                    variant="text"
                    size="medium"
                    sx={{
                        minWidth: 'auto',
                        '& .MuiButton-startIcon': {
                            margin: isSmallScreen ? 0 : '-1px 02px 0px 0px',
                        }
                    }}
                >
                    {isSmallScreen ? null : 'Exportar'}
                </Button>
            </Tooltip>
        </Toolbar>
    );
};

export default CustomToolBar;