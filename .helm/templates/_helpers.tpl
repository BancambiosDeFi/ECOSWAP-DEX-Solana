{{- define "container-image" -}}
{{/* 
replace of value "^" on "+" 
*/}}
{{- $image := .Values.container.image | replace "^" "+" -}}
{{- printf $image -}}
{{- end -}}
