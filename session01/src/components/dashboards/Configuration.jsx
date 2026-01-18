import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@mui/material/Divider";
import { Settings, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Configuration({ configurations, surfaceCardSx, theme }) {
  const navigate = useNavigate();

  // 🔑 Normalisation (objet OU tableau)
  const configuration = Array.isArray(configurations)
    ? configurations[0]
    : configurations;

  if (!configuration || typeof configuration !== "object") {
    return (
      <Paper elevation={0} sx={surfaceCardSx}>
        <Typography color="text.secondary">
          Aucune configuration disponible
        </Typography>
      </Paper>
    );
  }

  const {
    academicYears = [],
    semesters = [],
    courses = [],
  } = configuration;

  return (
    <Paper elevation={0} sx={surfaceCardSx}>
      {/* ===== HEADER ===== */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Settings size={18} color={theme.palette.secondary.main} />
        <Typography sx={{ fontWeight: 800 }}>
          Configuration
        </Typography>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* ===== ANNÉES ACADÉMIQUES ===== */}
      <ConfigAccordion
        title="Années académiques"
        items={academicYears}
        getLabel={(y) =>
          `${y.name} ${y.isActive ? "(active)" : "(fermée)"}`
        }
        emptyLabel="Aucune année académique"
        onNavigate={() => navigate("/academicyears")}
      />

      {/* ===== SEMESTRES ===== */}
      <ConfigAccordion
        title="Semestres"
        items={semesters}
        getLabel={(s) =>
          `${s.academicYear?.name || "Année inconnue"} — ${s.name} ${s.isActive ? "(actif)" : "(fermé)"
          }`
        }
        emptyLabel="Aucun semestre"
        onNavigate={() => navigate("/semester")}
      />


      {/* ===== COURS ===== */}
      <ConfigAccordion
        title="Cours"
        items={courses}
        getLabel={(c) => `${c.code} – ${c.name}`}
        emptyLabel="Aucun cours"
        onNavigate={() => navigate("/courses")}
      />
    </Paper>
  );
}

/* ===================== SOUS-COMPONENT ===================== */

function ConfigAccordion({ title, items, getLabel, emptyLabel, onNavigate }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        background: "transparent",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={16} />}
        sx={{
          px: 0,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography>{title}</Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {items.length}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 0, pt: 0 }}>
        {items.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary", ml: 1 }}>
            {emptyLabel}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {items.map((item) => (
              <Typography
                key={item._id}
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  ml: 1,
                }}
              >
                • {getLabel(item)}
              </Typography>
            ))}

            <Typography
              sx={{
                fontSize: 12,
                mt: 0.5,
                ml: 1,
                cursor: "pointer",
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={onNavigate}
            >
              Gérer →
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
