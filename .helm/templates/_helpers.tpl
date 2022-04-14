{{- define "container-image" -}}
{{/* 
replace of value "^" on "+" 
*/}}
{{- $image := .Values.deployment.container.image | replace "^" "+" -}}
{{- printf $image -}}
{{- end -}}
