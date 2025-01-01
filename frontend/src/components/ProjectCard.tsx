import { Button, Input, Textarea } from "@headlessui/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import clsx from "clsx";
import { Project, VisibilityType } from "@/index";
import { useRoute } from "ziggy-js";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export function ProjectCard({ project }: { project: Project }) {
  const route = useRoute();
  const queryClient = useQueryClient();
  const form = useForm<Project>({
    defaultValues: {
      id: project.id,
      name: project.name,
      description: project.description,
      visibility: project.visibility,
    },
    onSubmit: async ({ value }) => {
      await axios.patch(route("projects.update", { id: value.id! }), value);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <div className="card border p-4 gap-2">
      <div className="flex-row card-title">
        <form.Field
          name="name"
          children={(field) => (
            <Input
              className="nodrag input input-bordered"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="visibility"
          children={(field) => (
            <Button
              className={clsx(
                "nodrag btn btn-info",
                field.state.value === VisibilityType.Private &&
                  "btn-outline border-2"
              )}
              onClick={() =>
                field.state.value === VisibilityType.Private
                  ? field.setValue(VisibilityType.Public)
                  : field.setValue(VisibilityType.Private)
              }
            >
              {field.state.value == VisibilityType.Public ? (
                <MdVisibility />
              ) : (
                <MdVisibilityOff />
              )}
            </Button>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="nodrag btn btn-error btn-outline"
            >
              <FaTrashCan />
            </Button>
          )}
        />
      </div>
      <form.Field
        name="description"
        children={(field) => (
          <Textarea
            className="nodrag textarea textarea-bordered"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
    </div>
  );
}
