import React from "react";
import { Form } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import { Grid } from "@mui/material";
import { useMediaQuery } from "@mui/material";

const CustomTiny = ({ label, value, onChange, star }) => {
  const handleEditorChange = content => {
    onChange(content);
  };
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <div style={{ marginBottom: "20px" }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid
          item
          xs={3}
          style={{
            textAlign: "left",
            whiteSpace: "nowrap",
            marginLeft: isSmallScreen ? "-20px" : "-50px",
            position: "relative"
          }}
        >
          <Form.Label>
            {label} {star && <span style={{ color: "red" }}>*</span>}
          </Form.Label>
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            marginLeft: isSmallScreen ? "30px" : "50px",
            flexDirection: "row"
          }}
        >
          <Editor
            apiKey="ej7z7kiw2pa7jninca9igfvwhtyudh4pfodg6fvyuos6jmdk" // Ensure you use a real API key
            value={value}
            init={{
              height: 250,
              menubar: true, // Enable the menu bar
              branding: false,
              statusbar: false,
              z_index: 9999, // Hide the status bar (footer)
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount"
              ],
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
              menu: {
                edit: {
                  title: "Edit",
                  items: "undo redo | cut copy paste | selectall"
                },
                insert: {
                  title: "Insert",
                  items: "link image media | template | charmap | hr"
                },
                view: {
                  title: "View",
                  items: "visualaid | preview | fullscreen"
                },
                format: {
                  title: "Format",
                  items: [
                    "bold italic underline strikethrough superscript subscript code | formats blocks fonts fontSize align lineheight | forecolor backcolor | removeformat"
                  ].join(" | ")
                }
              },
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={handleEditorChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomTiny;
