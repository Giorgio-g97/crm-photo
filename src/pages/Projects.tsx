"use client";

import React, { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject, Project } from "@/utils/localStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

type ProjectStatus = "planning" | "in-progress" | "completed";

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Pianificazione",
  "in-progress": "In Corso",
  completed: "Completato",
};

const statusColors: Record<ProjectStatus, string> = {
  planning: "bg-yellow-500/20 text-yellow-700",
  "in-progress": "bg-blue-500/20 text-blue-700",
  completed: "bg-green-500/20 text-green-700",
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleAddClick = () => {
    setEditingProject({
      id: "",
      name: "",
      status: "planning",
      budget: 0,
      description: "",
      timestamp: "",
    });
    setIsAddingNew(true);
    setIsModalOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject({ ...project });
    setIsAddingNew(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    if (window.confirm(`Sei sicuro di voler eliminare il progetto "${project.name}"?`)) {
      try {
        deleteProject(project.id);
        setProjects(getProjects());
        showSuccess("Progetto eliminato con successo!");
      } catch (error) {
        console.error("Failed to delete project:", error);
        showError("Errore durante l'eliminazione del progetto.");
      }
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      if (!editingProject.name) {
        showError("Il nome del progetto è obbligatorio.");
        return;
      }
      try {
        if (isAddingNew) {
          addProject({
            name: editingProject.name,
            status: editingProject.status,
            budget: editingProject.budget,
            description: editingProject.description,
          });
          showSuccess("Progetto aggiunto con successo!");
        } else {
          updateProject(editingProject);
          showSuccess("Progetto aggiornato con successo!");
        }
        setProjects(getProjects());
        setIsModalOpen(false);
        setEditingProject(null);
        setIsAddingNew(false);
      } catch (error) {
        console.error("Failed to save project:", error);
        showError("Errore durante il salvataggio del progetto.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-2 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Progetti</h1>
          <p className="text-muted-foreground">
            Tieni traccia dei tuoi progetti attivi e completati.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/90 w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Aggiungi Progetto
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-xl italic border-2 border-dashed rounded-2xl">
            Nessun progetto ancora. Aggiungine uno!
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-card p-4 sm:p-6 rounded-2xl elevation-1 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:bg-secondary/20 transition-all duration-200 border border-transparent hover:border-primary/10 gap-4"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-lg text-foreground">{project.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                )}
                <p className="text-lg font-bold text-primary mt-2">€{project.budget.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(project)}
                  className="rounded-full h-9 w-9 hover:bg-primary/10 text-primary flex-shrink-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(project)}
                  className="rounded-full h-9 w-9 hover:bg-destructive/10 text-destructive flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingProject && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                {isAddingNew ? "Aggiungi Nuovo Progetto" : "Modifica Progetto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveProject} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nome Progetto</Label>
                <Input
                  id="project-name"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-status">Stato</Label>
                <Select
                  value={editingProject.status}
                  onValueChange={(value: ProjectStatus) => setEditingProject({ ...editingProject, status: value })}
                >
                  <SelectTrigger id="project-status" className="rounded-xl">
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Pianificazione</SelectItem>
                    <SelectItem value="in-progress">In Corso</SelectItem>
                    <SelectItem value="completed">Completato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-budget">Budget (€)</Label>
                <Input
                  id="project-budget"
                  type="number"
                  step="0.01"
                  value={editingProject.budget}
                  onChange={(e) => setEditingProject({ ...editingProject, budget: parseFloat(e.target.value) || 0 })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Descrizione</Label>
                <Textarea
                  id="project-description"
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="rounded-xl min-h-[80px]"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl">
                  {isAddingNew ? "Aggiungi" : "Salva modifiche"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Projects;