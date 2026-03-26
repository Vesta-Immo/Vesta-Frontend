// filepath: components/projects/ProjectCard.tsx
"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useState } from "react";
import type { Project } from '@/types/project';
import { useDeleteProject } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  onRename?: (project: Project) => void;
}

export default function ProjectCard({ project, onRename }: ProjectCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const deleteMutation = useDeleteProject();



  return (
    <>
      <Card
        component={Link}
        href={`/simulation/projects/${project.id}`}
        sx={{
          textDecoration: "none",
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              flexShrink: 0,
            }}
          >
            <FolderOpenIcon />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {project.name}
            </Typography>
            {project.location && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {project.location}
              </Typography>
            )}
          </Box>

          <IconButton
            edge="end"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <MenuItem
          component={Link}
          href={`/simulation/projects/${project.id}`}
          onClick={() => setAnchorEl(null)}
        >
          <ListItemIcon>
            <FolderOpenIcon fontSize="small" />
          </ListItemIcon>
          Ouvrir
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onRename?.(project);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Renommer
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            if (confirm(`Supprimer "${project.name}" ? Cette action est irréversible.`)) {
              deleteMutation.mutate(project.id);
            }
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
}
